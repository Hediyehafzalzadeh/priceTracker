import { sendPriceDropEmail } from "@/lib/email";
import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";




export async function GET() {
    return NextResponse.json({
        message : "price checking cron job is working fine !"
    })
    
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get("Authorization");
        const cronSecret = process.env.CRON_SECRET;
        if(!cronSecret || authHeader !== `Bearer ${cronSecret}`){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        }
        const supabase = createClient (
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
        );

        const {data : products , error : productsError} = await supabase
        .from("products").select("*") ;

        if(productsError) throw productsError ;
        console.log(`Found ${products.length} products to check`);


        const result = {
            total : products.length,
            updated : 0,
            failed : 0 , 
            priceChanges : 0 , 
            alertsSent : 0 ,
        };

        for(const product of products){
            try {
                const productData = await scrapeProduct(product.url) ;
                if(!productData.currentPrice){
                    result.failed++ ;
                    continue; 
                }
                const oldPrice = parseFloat(product.current_price);
                const newPrice = parseFloat(productData.currentPrice);
                


                await supabase.from("products").update({
                    current_price : newPrice ,
                    currency : productData.currencyCode || product.currency ,
                    name : productData.productName || product.name ,
                    image_url : productData.productImageUrl || product.image_url ,
                    updated_at : new Date().toISOString() ,
                }).eq("id" , product.id) ;


                if(oldPrice !== newPrice){
                    await supabase.from("price_history").insert({
                        product_id : product.id ,
                        price : newPrice ,
                        currency : productData.currencyCode || product.currency ,
                    }) ;
                    result.priceChanges++ ;
                    
                    
                    if(newPrice < oldPrice){
                    const {
                    data :{user} ,

                } = await supabase.auth.admin.getUserById(product.user_id) ;
                if(user?.email){
                    console.log("======================>",user.email);
                    const emailResult = await sendPriceDropEmail(
                        user.email ,
                        product , 
                        oldPrice , 
                        newPrice );

                        if(emailResult.success){
                            result.alertsSent++ ;
                        }
                    
                }
                }
                }

                result.updated++ ;
           
            }catch (error) { 
                console.error(`Error processing product ${product.id}:`, error);
                result.failed++;
             }  
        }

        return NextResponse.json({
      success: true,
      message: "Price check completed",
      result,
    });

    }catch (error) {
        console.error("Error in cron job:", error);
        return NextResponse.json({
             error: "An error occurred while checking prices." }, { status: 500 });
    }
}

// curl -X POST http://localhost:3000/api/cron/check-prices -H "Authorization: Bearer 2e9cc3fb21204622c3301bd9cd2f6ebec83ff8e67cf42f5aeb49fd87d995d0be"
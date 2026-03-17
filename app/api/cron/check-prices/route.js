import { sendPriceDropEmail } from "@/lib/email";
import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@supabase/supabase-js";
import { Currency } from "lucide-react";
import { NextResponse } from "next/server";




export async function GET() {
    return NextResponse.json({
        message : "price checking cron job is working fine !"
    })
    
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get("Authorization");
        const cronSecret = process.env.CRONE_SECRET;
        if(!cronSecret || authHeader !== `Bearer ${cronSecret}`){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        }
        const supabase = createClient (
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
        );

        const {data : products , error : productsError} = await supabase
        .from("products").select("*") ;

        if(productsError){
            console.error("Error fetching products:", productsError);
            
        }

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
                }

                const newPrice = parseFloat(productData.currentPrice) ;
                const oldPrice = parseFloat(product.current_price) ;

                await supabase.from("products").update({
                    current_price : newPrice ,
                    Currency : productData.currency || product.currency ,
                    name : productData.name || product.name ,
                    image_url : productData.imageUrl || product.image_url ,
                    updated_at : new Date().toISOString() ,
                }).eq("id" , product.id) ;


                if(newPrice !== oldPrice){
                    await supabase.from("price_history").insert({
                        product_id : product.id ,
                        price : newPrice ,
                        currency : productData.currency || product.currency ,
                    }) ;
                    result.priceChanges++ ;
                }

                const {
                    data :{user} ,

                } = await supabase.auth.admin.getUserById(product.user_id) ;

                if(user?.email){
                    const emailResult = await sendPriceDropEmail(
                        user.email ,
                        product , 
                        oldPrice , 
                        newPrice );

                        if(emailResult.success){
                            result.alertsSent++ ;
                        }
                    
                }



                
            }catch (error) { 
                console.error(`Error processing product ${product.id}:`, error);
                result.failed++;
             }  
        }

        return NextResponse.json({ message: "Price check completed", result });


    }catch (error) {
        console.error("Error in cron job:", error);
        return NextResponse.json({
             error: "An error occurred while checking prices." }, { status: 500 });
    }
}
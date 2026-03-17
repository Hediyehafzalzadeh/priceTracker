"use client" 


import { deleteProduct } from "@/app/actions";
import React, { useState } from "react" ; 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChevronDown, ChevronUp, ExternalLink, Trash2, TrendingDown } from "lucide-react";
import Link from "next/link";
import PriceChart from "./PriceChart";



const ProductCard = ({ product }) =>{

    const [showChart , setShowChart] = useState(false) ;
    const [deleting , setDeleting] = useState(false) ;
    const handleDelete = async () =>{
        if(!confirm("remove this product from tracking ? ")) return;
        setDeleting(true);
        await deleteProduct(product.id) ;
        if(result.error){
      toast.error(result.error);

    }else{
      toast.success(result.message || "Product added successfully");
      setUrl("");
      
    }
    setDeleting(false);



    }


    return <div className="">
        <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex gap-4">
            {product.image_url && (
                <img className="rounded-md object-cover border w-20 h-20" src={product.image_url} alt={product.name} />
            )}
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">{product.name}</h3>
            <div className="flex item-baseline gap-2 ">
                <span className="text-3xl font-bold text-violet-700">{product.currency} {product.current_price}</span>
                <Badge variant="secondary" className="gap-1">
                    <TrendingDown className="w-3 h-3"/>
                    Tracking ...
                </Badge>
            </div>

        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 ">
            <Button className=" gap-1 " variant="outline" size="sm" onClick={() => setShowChart(!showChart)}>
                {showChart ? ( <>
                <ChevronUp className="w-4 h-4"/>
                Hide chart
                </>) : ( <>
                <ChevronDown className="w-4 h-4"/>
                Show chart
                </>)}
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-1"> 
                <Link href={product.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4"/>View Product</Link>
            </Button>
            <Button variant="ghost " size="sm" onClick={handleDelete} disabled={deleting} className="text-red-400 hover:text-red-600 hover:bg-red-50 gap-1">
                <Trash2 className="w-4 h-4"/>
               Remove
            </Button>
        </div>
      </CardContent>
      {showChart && (
      <CardFooter className="pt-4">
        <PriceChart productId={product.id} />

      </CardFooter>)}
    </Card>

    </div>

}

export default ProductCard ; 
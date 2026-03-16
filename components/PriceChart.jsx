"use client"

import React, { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { getPriceHistory } from '@/app/actions';
const PriceChart = ({ productId }) => {
    const [data , setData] = useState([]);
    const [loading , setLoading] = useState(true);


    useEffect(()=> {
          async function fetchData() { 
            
          const priceHistory = await getPriceHistory(productId);
           setLoading(false);
            setData(priceHistory.map(item => ({
                date : new Date(item.checked_at).toLocaleDateString() , 
                price : item.price , 
            }))) ;
          }

        fetchData();

    }, [productId])
    
  

  return (
    <div>
      <LineChart
      style={{ width: '100%', maxWidth: '700px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-3)" />
      <XAxis dataKey="date" stroke="var(--color-text-3)" />
      <YAxis dataKey="price" width="auto" stroke="var(--color-text-3)" />
      <Tooltip
        cursor={{
          stroke: 'var(--color-border-2)',
        }}
        contentStyle={{
          backgroundColor: 'var(--color-surface-raised)',
          borderColor: 'var(--color-border-2)',
        }}
      />
      <Legend />
    
      <Line
        type="monotone"
        dataKey="price"
        stroke="var(--color-chart-2)"
        dot={{
          fill: 'var(--color-surface-base)',
        }}
        activeDot={{ stroke: 'var(--color-surface-base)' }}
      />
      <RechartsDevtools />
    </LineChart>
    </div>
  )
}

export default PriceChart;
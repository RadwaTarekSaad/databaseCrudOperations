const express=require("express");
const app=express();
const mySql=require("mysql2/promise")
const port=3000;

let db=mySql.createPool({
    host:"127.0.0.1",
    port:"3306",
    user:"root",
    password:"root",
    database:"retail_store",
    waitForConnections:true,
    queueLimit:0,
    connectionLimit:4

});

async function connectDb(){
   try{
    const[result]=await db.execute("select 1+1 as result");
   console.log(result);
   console.log("database connected successfully...❤");
   app.listen(port,()=>{
    console.log(`server is running on port ${port}` )
})
   }catch(e){
    console.log(e,"fail to connect database..😢")
   }
}

connectDb();


app.use(express.json());




app.post("/createProduct",async(req,res,next)=>{
   try{
     const{ProductName,Price,StockQuantity,Sup_ID}=req.body;
    const query=`insert into products(ProductName,Price,StockQuantity,Sup_ID) values 
    (?,?,?,?)`;
   const[ result] = await db.execute(query,[ProductName,Price,StockQuantity,Sup_ID])
   console.log(result);
   result.affectedRows>0?
     res.status(201).json({message:"product created successfullly..😊"}):
      res.status(500).json({message:"fail to create product😢"});
   
   }catch(error){
    if(error.errno===1062){
        return res.status(409).json({message:"product already exists"})
    }
     return res.status(400).json({error})
   }

})

app.get("/getAllProducts",async(req,res,next)=>{

   try{
     const query=`select * from products`

   const [result]= await db.execute(query);
   console.log(result)
  if(!result?.length){
    return res.status(404).json({message:"no products found"})
  }else{
    return res.status(200).json({message:"done😉",products:result})
  }
   }catch(error){
   return res.status(400).json({error})
    
   }

})


app.get("/product/:id",async(req,res,next)=>{
try{
        const{id}=req.params;
   const query=`select * from products where ProductID=?`
   const [result]= await db.execute(query,[id])
  if(!result?.length){
    return res.status(404).json({message:"product not found 🤔"})
  }
  return res.status(200).json({message:"done",product:result})
}catch(error){
     return res.status(400).json({error})

}
})


app.patch("/productUpdate/:id",async(req,res,next)=>{
    try{
        const{id}=req.params
    const{ProductName,Price,StockQuantity,Sup_ID}=req.body;
    const columns=[];
    const values=[];
    if(ProductName!==undefined){
        columns.push("ProductName=?");
        values.push(ProductName)
      }
      if(Price!==undefined){
        columns.push("Price=?");
        values.push(Price)
      }
       if(StockQuantity!==undefined){
        columns.push("StockQuantity=?");
        values.push(StockQuantity)
      }
       if(Sup_ID!==undefined){
        columns.push("Sup_ID=?");
        values.push(Sup_ID)
      }

      if (columns.length === 0) {
    return res.status(400).json({
        message: "No data to update"
    });
}
       values.push(id)
      const query=`update products set ${columns.join(",")} where ProductID=?`
      const [result]= await db.execute(query,values);
      console.log(result)
      if(!result?.affectedRows>0){
         return res.status(404).json({message:"product not found😒"})
      }
     
       return res.status(200).json({message:"product updated successfully😊 "})
     
    }catch(error){
        return res.status(400).json({error})
    }


})


app.patch("/productUpdateBreadPrice/:id",async(req,res,next)=>{
    try{
        const{id}=req.params
    const{Price}=req.body;
    const columns=[];
    const values=[];
    
      if(Price!==undefined){
        columns.push("Price=?");
        values.push(Price)
      }
       values.push(id)
      const query=`update products set ${columns[0]} where ProductID=?`
      const [result]= await db.execute(query,values);
      console.log(result)
      if(!result?.affectedRows>0){
         return res.status(404).json({message:"product not found😒"})
      }
     
       return res.status(200).json({message:"product updated successfully😊 "})
     
    }catch(error){
        return res.status(400).json({error})
    }


})


app.delete("/productDelete/:id",async(req,res,next)=>{
    try{
        const{id}=req.params
  
    
      const [result]=await db.execute("delete from products where ProductID=?",[id]);
      console.log(result);
    if(!result.affectedRows>0){
      return res.status(404).json({messsage:"product not found..🤔"})
    }
      return res.status(200).json({messsage:"product deleted successfully..😉"})
    }catch(error){
        return res.status(400).json({error})
    }


})

app.post("/addProCategoryColumn",async(req,res,next)=>{
try{
    const result=await db.execute("ALTER TABLE products ADD COLUMN Category VARCHAR(250)");
    return res.status(201).json({message:"category created successfully..😊"})
}catch(error){

    return res.status(400).json({error})

}

})

app.delete("/deleteProCategoryColumn",async(req,res,next)=>{
try{
    const result=await db.execute("ALTER TABLE products DROP COLUMN Category ");
    return res.status(200).json({message:"category deleted successfully..😊"})
}catch(error){

    return res.status(400).json({error})

}

})


app.patch("/productNameNotNull", async (req, res) => {
  try {
    await db.execute(` ALTER TABLE products MODIFY COLUMN ProductName VARCHAR(250) NOT NULL`);
    return res.status(200).json({
      message: "ProductName is now NOT NULL 😊"
    });

  } catch (error) {
    return res.status(400).json({ error });
  }
});



app.post("/createProduct/freshFood",async(req,res,next)=>{
   try{
     const{ProductName,Price,StockQuantity,Sup_ID}=req.body;
    const query=`insert into products(ProductName,Price,StockQuantity,Sup_ID) values 
    (?,?,?,?)`;
   const [result] = await db.execute(query,[ProductName,Price,StockQuantity,Sup_ID])
   console.log(result);
   !result.affectedRows>0? res.status(500).json({message:"fail to create product😢"}): res.status(201).json({message:"product created successfullly..😊"})
     
   
   }catch(error){
    if(error.errno===1062){
        return res.status(409).json({message:"product already exists"})
    }
     return res.status(400).json({error})
   }

})



app.delete("/productEggDelete/:id",async(req,res,next)=>{
    try{
        const{id}=req.params
  
    
      const [result]=await db.execute("delete from products where ProductID=?",[id]);
      console.log(result);
    if(!result.affectedRows>0){
      return res.status(404).json({messsage:"product not found..🤔"})
    }
      return res.status(200).json({messsage:"product deleted successfully..😉"})
    }catch(error){
        return res.status(400).json({error})
    }


})









app.patch("/updateSupContactNumber",async(req,res,next)=>{
try{
    const result=await db.execute("ALTER TABLE suppliers MODIFY ContactNumber varchar(15) ");
    return res.status(200).json({message:"ContactNumber updated successfully..😊"})
}catch(error){

    return res.status(400).json({error})

}

})









app.post("/createSupplier",async(req,res,next)=>{
   try{
     const{SupplierName,ContactNumber}=req.body;
    const query=`insert into suppliers(SupplierName,ContactNumber) values 
    (?,?)`;
   const[ result ]= await db.execute(query,[SupplierName,ContactNumber])
   console.log(result)
   result.affectedRows>0?
     res.status(201).json({message:"supplier created successfullly..😊"}):
      res.status(500).json({message:"fail to create supplier😢"});
  
   }catch(error){
    if(error.errno===1062){
        return res.status(409).json({message:"supplier already exists"})
    }
     return res.status(400).json({error})
   }

})



app.get("/getAllSuppliers",async(req,res,next)=>{

   try{
     const query=`select * from suppliers`

   const [result]= await db.execute(query);
   console.log(result)
  if(!result?.length){
    return res.status(404).json({message:"no suppliers found"})
  }else{
    return res.status(200).json({message:"done😉",suppliers:result})
  }
   }catch(error){
     return res.status(400).json({error})
    
   }

})



app.patch("/supplierUpdate/:id",async(req,res,next)=>{
    try{
        const{id}=req.params
    const{SupplierName,ContactNumber}=req.body;
    const columns=[];
    const values=[];
    if(SupplierName!==undefined){
        columns.push("SupplierName=?");
        values.push(SupplierName)
      }
      if(ContactNumber!==undefined){
        columns.push("ContactNumber=?");
        values.push(ContactNumber)
      }
     

      if (columns.length === 0) {
    return res.status(400).json({
        message: "No data to update"
    });
}
       values.push(id)
      const query=`update suppliers set ${columns.join(",")} where SupplierID=?`
      const [result]= await db.execute(query,values);
      console.log(result)
      if(!result?.affectedRows>0){
         return res.status(404).json({message:"supplier not found😒"})
      }
     
       return res.status(200).json({message:"supplier updated successfully😊 "})
     
    }catch(error){
        return res.status(400).json({error})
    }


})

app.delete("/supplierDelete/:id",async(req,res,next)=>{
    try{
        const{id}=req.params
  
    
      const [result]=await db.execute("delete from suppliers where SupplierID=?",[id]);
      console.log(result);
    if(!result.affectedRows>0){
      return res.status(404).json({messsage:"supplier not found..🤔"})
    }
      return res.status(200).json({messsage:"supplier deleted successfully..😉"})
    }catch(error){
        return res.status(400).json({error})
    }


})

app.post("/supplier/freshFood",async(req,res,next)=>{
    try{
        const{SupplierName,ContactNumber}=req.body;
   const [data]= await db.execute("insert into suppliers(SupplierName,ContactNumber) values (?,?)",[SupplierName,ContactNumber]);
  console.log(data);
  if(!data.affectedRows>0){
    return res.status(500).json({message:"fail to create freshFood supplier😢"})
  }
  return res.status(201).json({message:"freshFood supplier created successfully😊"})
    }catch(error){
        if(error.errno===1062){
            return res.status(404).json({message:"supplier already exists"})
        }
         return res.status(400).json({error})

    }
})





app.post("/recordSale",async(req,res,next)=>{
   try{
     const{pro_ID,QuantitySold,SaleDate}=req.body;
    
    query=`select * from products WHERE ProductID=?`
   const[ result ]= await db.execute(query,[pro_ID])
   console.log(result)
       if (result?.length === 0) {
      return res.status(404).json({
        message: "Product not found 😒"
      });
    }
    if (result[0].StockQuantity < QuantitySold) {
      return res.status(400).json({
        message: "Not enough stock 😢"
      });
    }
    
     const [sale] = await db.execute(
      "insert into sales(pro_ID, QuantitySold,SaleDate) values (?,?,?)",
      [pro_ID, QuantitySold,SaleDate]
    );
     await db.execute(
      "UPDATE products SET StockQuantity = StockQuantity - ?  WHERE ProductID=?",
      [QuantitySold, pro_ID]
    );

    if(sale?.affectedRows>0){
        return res.status(201).json({message:"sale created successfully..😉"})
    }

return res.status(500).json({message:"failed to create sale..😢"})
   
   
    


   }catch(error){
    
     return res.status(400).json({error})
   }

})




app.post("/recordSale/freshFood",async(req,res,next)=>{
   try{
     const{pro_ID,QuantitySold,SaleDate}=req.body;
    
    query=`select * from products WHERE ProductID=?`
   const[ result ]= await db.execute(query,[pro_ID])
   console.log(result)
       if (result?.length === 0) {
      return res.status(404).json({
        message: "Product not found 😒"
      });
    }
    if (result[0].StockQuantity < QuantitySold) {
      return res.status(400).json({
        message: "Not enough stock 😢"
      });
    }
    
     const [sale] = await db.execute(
      "insert into sales(pro_ID, QuantitySold,SaleDate) values (?,?,?)",
      [pro_ID, QuantitySold,SaleDate]
    );
     await db.execute(
      "UPDATE products SET StockQuantity = StockQuantity - ?  WHERE ProductID=?",
      [QuantitySold, pro_ID]
    );

    if(sale?.affectedRows>0){
        return res.status(201).json({message:"sale created successfully..😉"})
    }

return res.status(500).json({message:"failed to create sale..😢"})
   
   
    


   }catch(error){
    
     return res.status(400).json({error})
   }

})


app.get("/getAllSales",async(req,res,next)=>{

   try{
     const query=`select * from sales`

   const [result]= await db.execute(query);
   console.log(result)
  if(!result?.length){
    return res.status(404).json({message:"no sales found"})
  }else{
    return res.status(200).json({message:"done😉",sales:result})
  }
   }catch(error){
     return res.status(400).json({error})
    
   }

})

app.get("/salesOfProduct/:id",async(req,res,next)=>{
try{
        const{id}=req.params;
   const query=`select * from sales where pro_ID=?`
   const [result]= await db.execute(query,[id])
  if(!result?.length){
    return res.status(404).json({message:" not found sale on this product 🤔"})
  }
  return res.status(200).json({message:"done",productSales:result})
}catch(error){
     return res.status(400).json({error})

}
})







app.get("/reports/totalSoldPro", async (req,res,next) => {
  try {
    const query = `
      SELECT 
        p.ProductID,
        p.ProductName,
        SUM(s.QuantitySold) as TotalQuantitySold
      FROM products as p
      JOIN sales as s ON p.ProductID = s.pro_ID
      GROUP BY p.ProductID, p.ProductName
    `;

    const [result] = await db.execute(query);

    return res.status(200).json({
      message: "done 😊",
      products: result
    });

  } catch (error) {
    return res.status(500).json({ error });
  }
});



app.get("/reports/highestStockPro", async (req,res,next) => {
  try {
    const query = `
      SELECT *
      FROM products
      ORDER BY StockQuantity DESC
      LIMIT 1
    `;

    const [result] = await db.execute(query);

    if (result.length === 0) {
      return res.status(404).json({
        message: "No products found"
      });
    }

    return res.status(200).json({
      message: "done 😊",
      product: result[0]
    });

  } catch (error) {
    return res.status(500).json({ error });
  }
});

app.get("/reports/suppliersStartingWithF", async (req,res,next) => {
  try {
    const query = `
      SELECT *
      FROM suppliers
      WHERE SupplierName LIKE 'F%'
    `;

    const [result] = await db.execute(query);

    return res.status(200).json({
      message: "done 😊",
      suppliers: result
    });

  } catch (error) {
    return res.status(500).json({ error });
  }
});


app.get("/reports/neverSold", async (req, res , next) => {
  try {
    const query = `
      SELECT *
      FROM products as p
      LEFT JOIN sales as s 
        ON p.ProductID = s.pro_ID
      WHERE s.pro_ID is NULL
    `;

    const [result] = await db.execute(query);

    return res.status(200).json({
      message: "done 😊",
      products: result
    });

  } catch (error) {
    return res.status(500).json({ error });
  }
});

app.get("/reports/allSales", async (req, res , next) => {
  try {
    const query = `
      SELECT 
        p.ProductName,
        s.QuantitySold,
        s.SaleDate
      FROM sales as s
      JOIN products as p 
        ON s.pro_ID = p.ProductID
    `;

    const [result] = await db.execute(query);

    return res.status(200).json({
      message: "done 😊",
      sales: result
    });

  } catch (error) {
    return res.status(500).json({ error });
  }
});


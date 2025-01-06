import { Query } from "mongoose";

export class ApiFeatures<T> {
  public mongooseQuery: Query<T[], T>; 
  private queryString: Record<string, any>;
  public page :number
  constructor(mongooseQuery: Query<T[], T>, queryString: Record<string, any>) {
    this.mongooseQuery = mongooseQuery; 
    this.queryString = queryString; 
    this.page =1
  }

  // 1-pagination=========
  // http://localhost:3000/users?page=2

  pagination():this
 {
    let page_limit = 4;
  let page = this.queryString.page * 1 || 1;
  if (this.queryString.page <= 0) page = 1;
  let skip = (page - 1) * page_limit;
  this.page=page
  this.mongooseQuery.skip(skip).limit(page_limit)
return this
}

  // 2-filter===========
  // http://localhost:3000/users?name=farouk

filter():this{
  let filterObj: Record<string, any> ={...this.queryString};
  console.log(filterObj);

  let excludeQuery=['page','sort','fields','keyword']
  excludeQuery.forEach((q)=>{
    delete filterObj[q]
  })

 let filterString=JSON.stringify(filterObj)
filterString = filterString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
filterObj = JSON.parse(filterString);
this.mongooseQuery.find(filterObj)

return this

}
      // 3-sort=======
// http://localhost:3000/users?sort=-price,sold
sort(){

if (this.queryString.sort)
{
  let sortBy =this.queryString.sort.split(",").join(" "); //["-price","sold"] => -price sold
  this.mongooseQuery.sort(sortBy)
}
return this
}
  
        // 3-search=======
// http://localhost:3000/users?keyword=farouk
search(){
    if (this.queryString.keyword)
{
  this.mongooseQuery.find({
    $or:[
      {name:{$regex:this.queryString.keyword,$options:'i'}},
      {email:{$regex:this.queryString.keyword,$options:'i'}}

    ]
  })


}
return this
}
        // 5-fields=======
// http://localhost:3000/users?fields=name,email
fields(){
if (this.queryString.fields)
{
  let fields = this.queryString.fields.split(",").join(" "); 
  this.mongooseQuery.select(fields)
}

return this
}

}



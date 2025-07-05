export const groupBy = (array : any[], f : any, rem : string[]) => {
    let groups : any = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
    rem.forEach(key=>{
        delete o[key];
    })
      groups[group].push(o);
    });
 return Object.keys(groups).map(function (group) {
     let field = JSON.parse(group);
   return {
    ...field,
    booking_list:groups[group]};
 })
}


export const groupTranscationBy = (array : any[], f : any, rem : string[]) => {
  let groups : any = {};
  array.forEach(function (o) {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
  rem.forEach(key=>{
      delete o[key];
  })
    groups[group].push(o);
  });
return Object.keys(groups).map(function (group) {
   let field = JSON.parse(group);
 return {
  ...field,
  order_list:groups[group]};
})
}
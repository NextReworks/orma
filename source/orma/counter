(()=>{
    const propertyService = PropertiesService.getScriptProperties();
    const countProperty = propertyService.getProperty("count");
    if(countProperty){
        propertyService.setProperty("count",Number(countProperty)+1);
    }
    else{
       propertyService.setProperty("count",1);
    }
})();

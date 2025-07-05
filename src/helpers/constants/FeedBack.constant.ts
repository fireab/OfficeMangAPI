import _ from "lodash";

export const FeedBackConstant={
    Excellent:{
        index:5,
        name:"Excellent"
    },
    VeryGood:{
        index:4,
        name:"VeryGood"
    },
    Intermidiate:{
        index:3,
        name:"Intermediate"
    },
    Good:{
        index:2,
        name:"Good"
    },
    Bad:{
        index:1,
        name:"Bad"
    }
}
export const findFeedBack=(index:string):string=>{
    try {

    let index_number=Math.round(_.toNumber(index));
    if (index_number==FeedBackConstant.Excellent.index) {
        return FeedBackConstant.Excellent.name;
    } 
    if (index_number==FeedBackConstant.VeryGood.index) {
        return FeedBackConstant.VeryGood.name;
    }
    if (index_number==FeedBackConstant.Intermidiate.index) {
        return FeedBackConstant.Intermidiate.name;
    } 
    if (index_number==FeedBackConstant.Good.index) {
        return FeedBackConstant.Good.name;
    }
    if (index_number==FeedBackConstant.Bad.index) {
        return FeedBackConstant.Bad.name;
    }
    return FeedBackConstant.Bad.name;
            
    } catch (error) {
        return FeedBackConstant.Bad.name;
    }
}
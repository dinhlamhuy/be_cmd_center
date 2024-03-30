const { createResponse } = require("../../variables/createResponse");
const sfqModel = require("../StockFittingQuality/StockFittingQuality.models");
const assemblyQualityModel = require("./assemblyQuality.models");
exports.Get_Assembly_Quality = async (req, res) => {
  try {
    const erpTime = await sfqModel.getServerTime();
      // console.log(erpTime)
    const type_Lean_Mapping_All = await assemblyQualityModel.Get_Type_Lean_Mapping_All();   
    // console.log('data',type_Lean_Mapping_All)

    let data;
    let array = [];
    const Type_AutoCutting = await sfqModel.Type_AutoCutting();
    if (Type_AutoCutting === "adidas") {
      let num = 0,
        num3,
        num4;
      await type_Lean_Mapping_All.map(async (item, index) => {
        array[index] = await sfqModel.Get_PPH(item.Lean.trim(), erpTime);
        // array[index].Default_RFT = item.RFT;
        // array[index].JudgeToday = Type_AutoCutting;
        if (array[index].Actual_Output > 0.0) {
          num++;
        }
      });
      while (num4 < array.length) {
        if (array[num4].Actual_Output > 0.0) {
          array2[num3] = array[num4];
          num3++;
        }
        num4++;
      }
      data = array2;
    } else {
      await Promise.all(
        type_Lean_Mapping_All.map(async (item, index) => {
          if (item && item !== null) {
            // console.log(item.Lean, erpTime)
            const pphData = await sfqModel.Get_PPH(item.Lean, erpTime);
            if (pphData) {
           
              array.push(pphData);
            }

           
          }
        })
      );
      data = array;
      
    }
    
    await res.status(200).send(createResponse(0, "Thành công", data));
   
  } catch (error) {
    // console.log(error)
    res.status(500).send(createResponse(1001, "Lỗi server", error));
  }
};

exports.Load_Data = () => {
  return null;
};

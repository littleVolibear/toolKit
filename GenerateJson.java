package com.lenovo.bpt.planning.domain.planningproduct.rules;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class GenerateJson {

    public static void main(String[] args) throws JSONException {

        JSONArray planningProductList = new JSONArray();

        for (int i = 0; i < 500; i++) {
            String productValue = "Product " + (i + 1);
            JSONObject product = new JSONObject();
            product.put("product", productValue);
            product.put("productDescription", "Description " + productValue);
            product.put("productGroup", "Group " + productValue);
            product.put("productBrand", "Brand " + productValue);
            product.put("productSeries", "Series " + productValue);
            product.put("productFamily", "Family " + productValue);
            product.put("machineType", "Machine Type " + productValue);
            product.put("processor", "Processor " + productValue);
            product.put("hdd", "HDD " + productValue);
            product.put("ssd", "SSD " + productValue);
            product.put("ram", "RAM " + productValue);
            product.put("graphics", "Graphics " + productValue);
            product.put("screen", "Screen " + productValue);
            product.put("opticals", "Opticals " + productValue);
            product.put("os", "OS " + productValue);
            product.put("osDpk", "OS DPK " + productValue);
            product.put("color", "Color " + productValue);
            product.put("warranty", "Warranty " + productValue);
            product.put("office", "Office " + productValue);

            JSONArray details = new JSONArray();
            for (int j = 1; j <= 2; j++) {
                JSONObject detail = new JSONObject();
                detail.put("standardName", "Standard Name " + j);
                detail.put("character", "Character " + j);
                detail.put("characterValue", "Value " + j);
                details.put(detail);
            }

            product.put("details", details);
            planningProductList.put(product);
        }

        JSONObject data = new JSONObject();
        data.put("planningProductList", planningProductList);

        String jsonOutput = data.toString(4);
        System.out.println(jsonOutput);
    }
}



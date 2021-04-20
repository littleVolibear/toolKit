package com.lenovo.sob.sci.controller;

import com.alibaba.fastjson.JSON;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.lenovo.gsc.tech.framework.model.Message;
import com.lenovo.sob.commons.controller.SobBaseController;
import com.lenovo.sob.sci.dto.MaterialCheckDTO;
import com.lenovo.sob.sci.service.ScMbgBomFactCmlService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.function.BinaryOperator;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/costbom/scMbgBomFactCml")
public class ScMbgBomFactCmlController extends SobBaseController {
    @Autowired
    private ScMbgBomFactCmlService scMbgBomFactCmlService;

    @PostMapping("/materialCheck")
    public Message<List<String>> scMaterialCheck(@Validated @RequestBody MaterialCheckDTO materialCheckDTO) {
        return sendSuccessMessage(scMbgBomFactCmlService.scMaterialCheck(materialCheckDTO));
    }

    public static void main(String[] args) {
        //  Adapter-AdapterPin,Adapter-AdapterColor
        List<Map<String, String>> dataList = new ArrayList<Map<String, String>>();
        HashMap<String, String> map1 = Maps.newHashMap();
        map1.put("Status", "Released");
        map1.put("AdapterNB|DT|Share", "NB");
        map1.put("AdapterPin", "pin1/pin2");
        map1.put("AdapterColor", "Black/White");
        map1.put("Item Name", "");
        map1.put("id", "66");

        HashMap<String, String> map2 = Maps.newHashMap();
        map2.put("Status", "Released2");
        map2.put("AdapterNB|DT|Share", "NB2");
        map2.put("AdapterPin", "TBD2");
        map2.put("AdapterColor", "Black/White");
        map2.put("Item Name", "");
        map2.put("id", "67");

        HashMap<String, String> map3 = Maps.newHashMap();
        map3.put("Status", "Released3");
        map3.put("AdapterNB|DT|Share", "NB3");
        map3.put("AdapterPin", "TBD3");
        map3.put("AdapterColor", "Black");
        map3.put("Item Name", "Item Name3");
        map3.put("id", "68");
        dataList.add(map1);
        dataList.add(map2);
        dataList.add(map3);

        List<Map<String, String>> result = new ArrayList<Map<String, String>>();
        LinkedHashMap<String, List<String>> needSplitMap = Maps.newLinkedHashMap();

        ArrayList<String> ruleList = Lists.newArrayList("Adapter-AdapterPin", "Adapter-AdapterColor");
        List<String> newRuleList = ruleList.stream().map(rule -> {
            String[] split = rule.split("-");
            return split[1];
        }).collect(Collectors.toList());
        // 拼装数据 itemId ### attributeKey  value:list
        // {"67###AdapterColor":["Black","White"],"66###AdapterColor":["Black","White"]}   needSplitMap
        // id List<String> itemIdAttributeNameMap
        HashSet<String> containTwoValueOfItemId = Sets.newHashSet();
        LinkedHashMap<String, List<String>> itemIdAttributeNameMap = Maps.newLinkedHashMap();
        dataList.stream().forEach(map -> {
            map.entrySet().stream().forEach(ele -> {
                String attributeKey = ele.getKey();
                String attributeValue = ele.getValue();
                if (StringUtils.isNotBlank(attributeValue) && attributeValue.contains("/") && newRuleList.contains(attributeKey)) {
                    String[] split = attributeValue.split("/");
                    needSplitMap.put(map.get("id") + "###" + attributeKey, Lists.newArrayList(split[0], split[1]));
                    containTwoValueOfItemId.add(map.get("id"));
                    if(itemIdAttributeNameMap.containsKey(map.get("id"))){
                        itemIdAttributeNameMap.get(map.get("id")).add(attributeKey);
                    }else{
                        itemIdAttributeNameMap.put(map.get("id"), Lists.newArrayList(attributeKey));
                    }
                }
            });
        });

        //{"66":["AdapterPin","AdapterColor"],"67":["AdapterColor"]}
        System.out.println(JSON.toJSON(itemIdAttributeNameMap));


        //{"66":[{"66###AdapterPin":["pin1","pin2"]},{"66###AdapterColor":["Black","White"]}],"67":[{"67###AdapterColor":["Black","White"]}]}
        Map<String, List<Map.Entry<String, List<String>>>> groupMap = needSplitMap.entrySet().stream().collect(Collectors.groupingBy(map -> map.getKey().split("###")[0]));
//        System.out.println(JSON.toJSON(groupMap));

        LinkedHashMap<String, List<List<String>>> eachItemIdMultipleCombineMap = Maps.newLinkedHashMap();
        groupMap.entrySet().stream().forEach(map->{
            List<List<String>> list = new ArrayList<List<String>>();
            String itemId = map.getKey();
            List<Map.Entry<String, List<String>>> attributeSumList = map.getValue();
            attributeSumList.stream().forEach(attributeMap->{
                List<String> attributeValue = attributeMap.getValue();
//                attributeValue.stream().forEach(System.out::println);
                list.add(attributeValue);
            });

            List<List<String>> multipleCombineList = new ArrayList<List<String>>();//每个itemId所有的组合
            descartes(list, multipleCombineList, 0, new ArrayList<String>());
            eachItemIdMultipleCombineMap.put(itemId, multipleCombineList);
//            System.out.println(JSON.toJSON(multipleCombineList));
        });
        System.out.println(JSON.toJSON(eachItemIdMultipleCombineMap));

        // 开始组装数据
        // {"66":["AdapterPin","AdapterColor"],"67":["AdapterColor"]}
        HashMap<String, List<Map<String, String>>> finalMap = Maps.newHashMap();// itemId attributeMap--List
        itemIdAttributeNameMap.entrySet().stream().forEach(map->{
            String itemId = map.getKey();
            List<String> attributeList = map.getValue();
            List<List<String>> eachItemSumAttributeList = eachItemIdMultipleCombineMap.get(itemId);
            eachItemSumAttributeList.stream().forEach(eleList->{
                Map<String, String> combineResultMap = attributeList.stream().collect(Collectors.toMap(attributeName -> attributeName, attributeName -> eleList.get(attributeList.indexOf(attributeName)), (v1, v2) -> v1));
                System.out.println(JSON.toJSON(combineResultMap));
                if(finalMap.containsKey(itemId)){
                    finalMap.get(itemId).add(combineResultMap);
                }else{
                    finalMap.put(itemId, Lists.newArrayList(combineResultMap));
                }
            });
        });
        System.out.println(JSON.toJSON(finalMap));

//        ArrayList<String> list1 = Lists.newArrayList("titile1", "title2");//attributeList
//        ArrayList<String> list2 = Lists.newArrayList("data1", "data2");//eleList
//        Map<String, String> result66 = list1.stream().collect(Collectors.toMap(ele -> ele, ele -> list2.get(list1.indexOf(ele)), (v1, v2) -> v2));
//        System.out.println(JSON.toJSON(result66));






        //{"66":[{"66###AdapterColor":["Black","White"]},{"66###AdapterPin":["pin1","pin2"]}],"67":[{"67###AdapterColor":["Black","White"]}]}


        List<List<String>> list = new ArrayList<List<String>>();
        List<String> listSub1 = new ArrayList<String>();
        List<String> listSub2 = new ArrayList<String>();
        List<String> listSub3 = new ArrayList<String>();
        List<String> listSub4 = new ArrayList<String>();
        listSub1.add("1");
        listSub1.add("2");

        listSub2.add("3");
        listSub2.add("4");

        listSub3.add("a");
        listSub3.add("b");

        listSub4.add("uu");
        listSub4.add("gg");

        list.add(listSub1);
        list.add(listSub2);
        list.add(listSub3);
        list.add(listSub4);
        List<List<String>> result2 = new ArrayList<List<String>>();
        descartes(list, result2, 0, new ArrayList<String>());
//        System.out.println(JSON.toJSONString(result2));
//        System.out.println("length:===" + result2.size());


    }


    public static void descartes(List<List<String>> dimvalue, List<List<String>> result, int layer, List<String> curList) {
        if (layer < dimvalue.size() - 1) {
            if (dimvalue.get(layer).size() == 0) {
                descartes(dimvalue, result, layer + 1, curList);
            } else {
                for (int i = 0; i < dimvalue.get(layer).size(); i++) {
                    List<String> list = new ArrayList<String>(curList);
                    list.add(dimvalue.get(layer).get(i));
                    descartes(dimvalue, result, layer + 1, list);
                }
            }
        } else if (layer == dimvalue.size() - 1) {
            if (dimvalue.get(layer).size() == 0) {
                result.add(curList);
            } else {
                for (int i = 0; i < dimvalue.get(layer).size(); i++) {
                    List<String> list = new ArrayList<String>(curList);
                    list.add(dimvalue.get(layer).get(i));
                    result.add(list);
                }
            }
        }
    }


}

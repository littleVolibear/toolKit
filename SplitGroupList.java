package com.lenovo.bpt.planning.infrastructure.planningproduct;

import java.util.ArrayList;
import java.util.List;

public class SplitGroupList {

    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>();
        // 添加一些示例数据到列表中
        for (int i = 1; i <= 10; i++) {
            numbers.add(i);
        }

        List<List<Integer>> splitGroups = splitList(numbers, 3);
        int groupCount = splitGroups.size();
        System.out.println("分组数量: " + groupCount);
    }

    public static <T> List<List<T>> splitList(List<T> list, int groupSize) {
        List<List<T>> splitGroups = new ArrayList<>();
        int listSize = list.size();
        for (int i = 0; i < listSize; i += groupSize) {
            int endIndex = Math.min(i + groupSize, listSize);
            List<T> group = list.subList(i, endIndex);
            splitGroups.add(group);
        }
        return splitGroups;
    }
}


package com.lenovo.bpt.planning.infrastructure.planningproduct;

import java.util.ArrayList;
import java.util.List;

public class SplitGroupCount {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>();
        // 添加一些示例数据到列表中
        for (int i = 1; i <= 10; i++) {
            numbers.add(i);
        }

        int groupCount = getGroupCount(numbers, 5);
        System.out.println("分组数量: " + groupCount);
    }

    public static <T> int getGroupCount(List<T> list, int groupSize) {
        int listSize = list.size();
        int groupCount = listSize / groupSize;
        if (listSize % groupSize != 0) {
            groupCount++;
        }
        return groupCount;
    }
}

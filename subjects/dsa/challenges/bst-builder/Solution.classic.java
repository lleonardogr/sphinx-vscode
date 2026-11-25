import java.util.*;

public class Main {

    // The same tree in parallel arrays (node i has key[i], left[i], right[i]; -1 is no child),
    // walked without recursion.
    static int[] key, left, right;
    static int count = 0;

    static void insert(int k) {
        key[count] = k;
        left[count] = -1;
        right[count] = -1;
        if (count > 0) {
            int at = 0;
            while (true) {
                if (k < key[at]) {
                    if (left[at] < 0) { left[at] = count; break; }
                    at = left[at];
                } else {
                    if (right[at] < 0) { right[at] = count; break; }
                    at = right[at];
                }
            }
        }
        count++;
    }

    static String inOrder() {
        StringBuilder out = new StringBuilder();
        Deque<Integer> stack = new ArrayDeque<>();
        int at = 0;
        while (at >= 0 || !stack.isEmpty()) {
            while (at >= 0) {
                stack.push(at);
                at = left[at];
            }
            at = stack.pop();
            out.append(out.length() == 0 ? "" : " ").append(key[at]);
            at = right[at];
        }
        return out.toString();
    }

    static String preOrder() {
        StringBuilder out = new StringBuilder();
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(0);
        while (!stack.isEmpty()) {
            int at = stack.pop();
            out.append(out.length() == 0 ? "" : " ").append(key[at]);
            if (right[at] >= 0) stack.push(right[at]);
            if (left[at] >= 0) stack.push(left[at]);
        }
        return out.toString();
    }

    // Post-order is the reverse of a node, right, left walk.
    static String postOrder() {
        List<Integer> order = new ArrayList<>();
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(0);
        while (!stack.isEmpty()) {
            int at = stack.pop();
            order.add(key[at]);
            if (left[at] >= 0) stack.push(left[at]);
            if (right[at] >= 0) stack.push(right[at]);
        }
        StringBuilder out = new StringBuilder();
        for (int i = order.size() - 1; i >= 0; i--) {
            out.append(out.length() == 0 ? "" : " ").append(order.get(i));
        }
        return out.toString();
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        key = new int[n];
        left = new int[n];
        right = new int[n];
        for (int i = 0; i < n; i++) {
            insert(scanner.nextInt());
        }
        // Height and leaves level by level, with a queue.
        int height = 0, leaves = 0;
        Queue<Integer> level = new ArrayDeque<>();
        level.add(0);
        while (!level.isEmpty()) {
            height++;
            for (int size = level.size(); size > 0; size--) {
                int at = level.remove();
                if (left[at] < 0 && right[at] < 0) leaves++;
                if (left[at] >= 0) level.add(left[at]);
                if (right[at] >= 0) level.add(right[at]);
            }
        }
        System.out.println("in-order: " + inOrder());
        System.out.println("pre-order: " + preOrder());
        System.out.println("post-order: " + postOrder());
        System.out.println("height: " + height);
        System.out.println("leaves: " + leaves);
    }
}

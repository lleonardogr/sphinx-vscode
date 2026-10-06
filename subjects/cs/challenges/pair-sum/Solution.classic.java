import java.util.*;

public class Main {

    static int[] bruteForce(int[] a, int target) {
        int checks = 0;
        for (int i = 0; i < a.length; i++) {
            for (int j = i + 1; j < a.length; j++) {
                checks++;
                if (a[i] + a[j] == target) {
                    return new int[] {checks, i, j};
                }
            }
        }
        return new int[] {checks, -1, -1};
    }

    static int twoPointers(int[] a, int target) {
        int[] s = a.clone();
        Arrays.sort(s);
        int checks = 0;
        for (int lo = 0, hi = s.length - 1; lo < hi; ) {
            checks++;
            if (s[lo] + s[hi] == target) {
                break;
            }
            if (s[lo] + s[hi] < target) {
                lo++;
            } else {
                hi--;
            }
        }
        return checks;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }
        int target = scanner.nextInt();
        int[] result = bruteForce(numbers, target);
        System.out.println(result[1] < 0 ? "Pair: none" : "Pair: " + numbers[result[1]] + " + " + numbers[result[2]]);
        System.out.println("Brute force: " + result[0]);
        System.out.println("Two pointers: " + twoPointers(numbers, target));
    }
}

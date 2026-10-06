import java.util.Scanner;

public class Main {

    static int linearSteps(int[] a, int target) {
        for (int i = 0; i < a.length; i++) {
            if (a[i] == target) {
                return i + 1;
            }
        }
        return a.length;
    }

    static int binarySteps(int[] a, int target) {
        int lo = 0, hi = a.length - 1, steps = 0;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            steps++;
            if (a[mid] == target) {
                return steps;
            }
            if (a[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return steps;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }
        int target = scanner.nextInt();
        boolean found = false;
        for (int x : numbers) {
            found = found || x == target;
        }
        System.out.println("Linear: " + linearSteps(numbers, target));
        System.out.println("Binary: " + binarySteps(numbers, target));
        System.out.println("Found: " + (found ? "yes" : "no"));
    }
}

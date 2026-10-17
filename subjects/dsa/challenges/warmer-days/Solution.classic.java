import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] temps = new int[n];
        for (int i = 0; i < n; i++) {
            temps[i] = scanner.nextInt();
        }
        // From the last day back: the stack holds the days that can still be "the next warmer day".
        int[] stack = new int[n];
        int top = 0;
        int longest = 0, fromDay = -1, never = 0;
        for (int day = n - 1; day >= 0; day--) {
            while (top > 0 && temps[stack[top - 1]] <= temps[day]) {
                top--;
            }
            if (top == 0) {
                never++;
            } else {
                int wait = stack[top - 1] - day;
                if (wait >= longest) {
                    longest = wait;
                    fromDay = day;
                }
            }
            stack[top++] = day;
        }
        System.out.println("longest wait: " + longest);
        System.out.println("from day: " + (fromDay < 0 ? "none" : Integer.toString(fromDay + 1)));
        System.out.println("never warmer: " + never);
    }
}

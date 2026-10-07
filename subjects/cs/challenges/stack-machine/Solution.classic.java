import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        ArrayDeque<Long> stack = new ArrayDeque<>();
        String error = null;
        for (int line = 1; line <= n && error == null; line++) {
            String[] p = scanner.nextLine().trim().split(" ");
            String op = p[0];
            if (op.equals("PUSH")) {
                stack.push(Long.parseLong(p[1]));
            } else if (op.equals("DUP") || op.equals("PRINT")) {
                if (stack.isEmpty()) {
                    error = "Error at line " + line + ": stack underflow";
                } else if (op.equals("DUP")) {
                    stack.push(stack.peek());
                } else {
                    System.out.println(stack.pop());
                }
            } else if (op.equals("ADD") || op.equals("SUB") || op.equals("MUL")) {
                if (stack.size() < 2) {
                    error = "Error at line " + line + ": stack underflow";
                } else {
                    long b = stack.pop();
                    long a = stack.pop();
                    if (op.equals("ADD")) {
                        stack.push(a + b);
                    } else if (op.equals("SUB")) {
                        stack.push(a - b);
                    } else {
                        stack.push(a * b);
                    }
                }
            } else {
                error = "Error at line " + line + ": unknown instruction";
            }
        }
        if (error != null) {
            System.out.println(error);
        } else if (stack.isEmpty()) {
            System.out.println("Stack: empty");
        } else {
            List<Long> bottomToTop = new ArrayList<>(stack);
            Collections.reverse(bottomToTop);
            StringBuilder sb = new StringBuilder();
            for (long v : bottomToTop) {
                sb.append(sb.length() == 0 ? "" : " ").append(v);
            }
            System.out.println("Stack: " + sb);
        }
    }
}

import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] names = {"HALT", "LOAD", "ADD", "SUB", "STORE", "JUMP", "JZ", "OUT"};
        int n = scanner.nextInt();
        for (int i = 0; i < n; i++) {
            String instruction = scanner.next();
            boolean valid = instruction.length() == 8;
            for (int k = 0; k < instruction.length() && valid; k++) {
                valid = instruction.charAt(k) == '0' || instruction.charAt(k) == '1';
            }
            if (!valid) {
                System.out.println("Invalid instruction");
                continue;
            }
            int opcode = Integer.parseInt(instruction.substring(0, 4), 2);
            int operand = Integer.parseInt(instruction.substring(4), 2);
            if (opcode > 7) {
                System.out.println("Unknown opcode " + instruction.substring(0, 4));
            } else if (opcode == 0 || opcode == 7) {
                System.out.println(names[opcode]);
            } else {
                System.out.println(names[opcode] + " " + operand);
            }
        }
    }
}

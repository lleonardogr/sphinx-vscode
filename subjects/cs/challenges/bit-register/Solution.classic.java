import java.util.Scanner;

public class Main {

    static String bits(int value) {
        String s = "";
        for (int i = 0; i < 8; i++) {
            s = ((value & (1 << i)) != 0 ? "1" : "0") + s;
        }
        return s;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int register = 0;
        String line = scanner.nextLine().trim();
        while (!line.equals("end")) {
            String[] parts = line.split(" ");
            String command = parts[0];
            boolean known = true;
            if (command.equals("not")) {
                register = ~register;
            } else if (parts.length == 2) {
                int n = Integer.parseInt(parts[1]);
                if (command.equals("set")) {
                    register |= 1 << n;
                } else if (command.equals("clear")) {
                    register &= ~(1 << n);
                } else if (command.equals("toggle")) {
                    register ^= 1 << n;
                } else if (command.equals("shl")) {
                    register <<= n;
                } else if (command.equals("shr")) {
                    register >>= n;
                } else {
                    known = false;
                }
            } else {
                known = false;
            }
            register &= 0xFF;
            System.out.println(known ? bits(register) : "Unknown command: " + line);
            line = scanner.nextLine().trim();
        }
    }
}

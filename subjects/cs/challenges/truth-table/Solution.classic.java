import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String gate = scanner.next();
        String outputs;
        if (gate.equals("AND")) {
            outputs = "0001";
        } else if (gate.equals("OR")) {
            outputs = "0111";
        } else if (gate.equals("XOR")) {
            outputs = "0110";
        } else if (gate.equals("NAND")) {
            outputs = "1110";
        } else if (gate.equals("NOR")) {
            outputs = "1000";
        } else {
            outputs = null;
        }
        if (outputs == null) {
            System.out.println("Unknown gate: " + gate);
        } else {
            System.out.println("A B OUT");
            for (int row = 0; row < 4; row++) {
                System.out.println(row / 2 + " " + row % 2 + " " + outputs.charAt(row));
            }
        }
    }
}

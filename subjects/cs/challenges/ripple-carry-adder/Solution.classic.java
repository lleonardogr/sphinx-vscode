import java.util.Scanner;

public class Main {

    static int[] fullAdder(int a, int b, int carryIn) {
        int half = a ^ b;
        return new int[] {half ^ carryIn, (a & b) | (half & carryIn)};
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String a = scanner.next();
        String b = scanner.next();
        char[] sum = new char[8];
        char[] carries = new char[8];
        int carry = 0;
        for (int i = 7; i >= 0; i--) {
            int[] out = fullAdder(a.charAt(i) == '1' ? 1 : 0, b.charAt(i) == '1' ? 1 : 0, carry);
            sum[i] = out[0] == 1 ? '1' : '0';
            carry = out[1];
            carries[i] = carry == 1 ? '1' : '0';
        }
        System.out.println("Sum: " + new String(sum));
        System.out.println("Carries: " + new String(carries));
        System.out.println("Carry out: " + carry);
    }
}

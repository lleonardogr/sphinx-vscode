import java.util.Scanner;

public class Main {

    static long readLE(String[] hex, int start, int count) {
        long value = 0;
        long weight = 1;
        for (int i = 0; i < count; i++) {
            value += Integer.parseInt(hex[start + i], 16) * weight;
            weight *= 256;
        }
        return value;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] hex = scanner.nextLine().trim().split(" ");
        boolean bmp = hex[0].equals("42") && hex[1].equals("4D");
        if (!bmp) {
            System.out.println("Not a BMP file");
        } else {
            System.out.println("Format: BMP");
            System.out.println("Width: " + readLE(hex, 18, 4));
            System.out.println("Height: " + readLE(hex, 22, 4));
            System.out.println("Bits per pixel: " + readLE(hex, 28, 2));
            System.out.println("File size: " + readLE(hex, 2, 4) + " bytes");
        }
    }
}

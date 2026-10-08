import java.util.Scanner;

public class Main {

    static boolean sorted(int[] list) {
        boolean ok = true;
        for (int i = 0; i + 1 < list.length; i++) {
            ok = ok && list[i] <= list[i + 1];
        }
        return ok;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int[] a = new int[scanner.nextInt()];
        for (int i = 0; i < a.length; i++) {
            a[i] = scanner.nextInt();
        }
        int[] b = new int[scanner.nextInt()];
        for (int i = 0; i < b.length; i++) {
            b[i] = scanner.nextInt();
        }
        if (!sorted(a)) {
            System.out.println("List A is not sorted");
        } else if (!sorted(b)) {
            System.out.println("List B is not sorted");
        } else {
            int[] result = new int[a.length + b.length];
            int i = 0;
            int j = 0;
            int comparisons = 0;
            for (int k = 0; k < result.length; k++) {
                boolean takeA;
                if (i == a.length) {
                    takeA = false;
                } else if (j == b.length) {
                    takeA = true;
                } else {
                    comparisons++;
                    takeA = a[i] <= b[j];
                }
                if (takeA) {
                    result[k] = a[i];
                    i++;
                } else {
                    result[k] = b[j];
                    j++;
                }
            }
            String line = "";
            for (int k = 0; k < result.length; k++) {
                line += (k > 0 ? " " : "") + result[k];
            }
            System.out.println(line);
            System.out.println("Comparisons: " + comparisons);
        }
    }
}

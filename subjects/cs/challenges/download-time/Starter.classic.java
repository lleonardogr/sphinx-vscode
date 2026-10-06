import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long sizeAmount = scanner.nextLong();
        String sizeUnit = scanner.next();   // for example MB
        long speedAmount = scanner.nextLong();
        String speedUnit = scanner.next();  // for example Mbps

        // TODO: turn the size into bytes and the speed into bits per second (write a method for each),
        // then print the time as Time: h:mm:ss, rounded up to a whole second
    }
}

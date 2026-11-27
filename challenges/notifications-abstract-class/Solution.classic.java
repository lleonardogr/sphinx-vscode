import java.util.Locale;
import java.util.Scanner;

abstract class Notification {
    private final String to;

    Notification(String to) {
        this.to = to;
    }

    abstract String channel();

    abstract String format(String text);

    String send(String text) {
        return channel() + " to " + to + ": " + format(text);
    }
}

class Email extends Notification {
    Email(String to) {
        super(to);
    }

    String channel() {
        return "EMAIL";
    }

    String format(String text) {
        return text;
    }
}

class Sms extends Notification {
    Sms(String to) {
        super(to);
    }

    String channel() {
        return "SMS";
    }

    String format(String text) {
        return text.length() <= 16 ? text : text.substring(0, 13) + "...";
    }
}

class Push extends Notification {
    Push(String to) {
        super(to);
    }

    String channel() {
        return "PUSH";
    }

    String format(String text) {
        return text.toUpperCase(Locale.ROOT);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String[] parts = scanner.nextLine().split(" ", 3);
            Notification note;
            if (parts[0].equals("email")) {
                note = new Email(parts[1]);
            } else if (parts[0].equals("sms")) {
                note = new Sms(parts[1]);
            } else {
                note = new Push(parts[1]);
            }
            System.out.println(note.send(parts[2]));
        }
    }
}

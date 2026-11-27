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

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().split(" ", 3);
        Notification note = switch (parts[0]) {
            case "email" -> new Email(parts[1]);
            case "sms" -> new Sms(parts[1]);
            default -> new Push(parts[1]);
        };
        IO.println(note.send(parts[2]));
    }
}

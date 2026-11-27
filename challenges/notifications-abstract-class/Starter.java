// TODO: write an abstract class Notification:
//   - a private final field with the recipient, set by its constructor
//   - abstract String channel()             ("EMAIL", "SMS" or "PUSH")
//   - abstract String format(String text)   (how this channel shapes the text)
//   - String send(String text), which returns: CHANNEL to RECIPIENT: formatted text

// TODO: write Email, Sms and Push, each extending Notification

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().split(" ", 3);   // type, recipient, text
        // TODO: create the right notification for parts[0] and print what send(parts[2]) returns
    }
}

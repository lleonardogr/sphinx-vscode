import java.util.*;

class Ticket {
    private static int created = 0;
    private final int id;
    private final String title;

    Ticket(String title) {
        created++;
        id = created;
        this.title = title;
    }

    int getId() {
        return id;
    }

    String getTitle() {
        return title;
    }

    static int count() {
        return created;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        List<Ticket> tickets = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            tickets.add(new Ticket(scanner.nextLine().trim()));
        }
        for (Ticket t : tickets) {
            System.out.println("#" + t.getId() + " " + t.getTitle());
        }
        System.out.println("Tickets created: " + Ticket.count());
    }
}

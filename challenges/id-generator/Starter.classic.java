import java.util.*;

class Ticket {
    // TODO: add a static counter shared by all tickets, and the fields id and title

    Ticket(String title) {
        // TODO: give this ticket the next id and store the title
    }

    int getId() {
        return 0;
    }

    String getTitle() {
        return "";
    }

    // TODO: return how many tickets were created so far
    static int count() {
        return 0;
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

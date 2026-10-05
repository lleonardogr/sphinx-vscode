import java.util.*;

class Ticket {
    // TODO: crie um contador static compartilhado por todos os tickets, e os campos id e title

    Ticket(String title) {
        // TODO: dê a este ticket o próximo id e guarde o título
    }

    int getId() {
        return 0;
    }

    String getTitle() {
        return "";
    }

    // TODO: devolva quantos tickets foram criados até agora
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

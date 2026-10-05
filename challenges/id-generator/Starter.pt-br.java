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

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<Ticket> tickets = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        tickets.add(new Ticket(IO.readln().trim()));
    }
    for (Ticket t : tickets) {
        IO.println("#" + t.getId() + " " + t.getTitle());
    }
    IO.println("Tickets created: " + Ticket.count());
}

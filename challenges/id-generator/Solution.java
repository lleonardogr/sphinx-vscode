class Ticket {
    private static int nextId = 1;
    private final int id;
    private final String title;

    Ticket(String title) {
        this.id = nextId++;
        this.title = title;
    }

    int getId() {
        return id;
    }

    String getTitle() {
        return title;
    }

    static int count() {
        return nextId - 1;
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

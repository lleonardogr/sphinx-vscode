import java.util.*;

class Book {
    final String id;
    final String title;
    String borrower;

    Book(String id, String title) {
        this.id = id;
        this.title = title;
    }
}

class Library {
    private final Map<String, Book> books = new TreeMap<>();
    private final Map<String, Integer> members = new HashMap<>();

    String add(String id, String title) {
        if (books.containsKey(id)) return "Book " + id + " already exists";
        books.put(id, new Book(id, title));
        return "Added book " + id + ": " + title;
    }

    String join(String name) {
        if (members.containsKey(name)) return "Member " + name + " already exists";
        members.put(name, 0);
        return "Member " + name + " joined";
    }

    String borrow(String id, String name) {
        Book book = books.get(id);
        if (book == null) return "No book " + id;
        if (!members.containsKey(name)) return "No member " + name;
        if (book.borrower != null) return book.title + " is already borrowed by " + book.borrower;
        if (members.get(name) == 2) return name + " has reached the limit of 2 books";
        book.borrower = name;
        members.merge(name, 1, Integer::sum);
        return name + " borrowed " + book.title;
    }

    String giveBack(String id) {
        Book book = books.get(id);
        if (book == null) return "No book " + id;
        if (book.borrower == null) return book.title + " is not borrowed";
        members.merge(book.borrower, -1, Integer::sum);
        book.borrower = null;
        return book.title + " returned";
    }

    List<String> list() {
        List<String> lines = new ArrayList<>();
        for (Book b : books.values()) {
            lines.add(b.id + " " + b.title + " - " + (b.borrower == null ? "available" : "borrowed by " + b.borrower));
        }
        if (lines.isEmpty()) lines.add("No books");
        return lines;
    }

    String summary() {
        int borrowed = 0;
        for (Book b : books.values()) if (b.borrower != null) borrowed++;
        return "Books: " + books.size() + ", borrowed: " + borrowed;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Library library = new Library();
        boolean running = true;
        while (running) {
            String[] p = scanner.nextLine().trim().split(" ", 3);
            String command = p[0];
            if (command.equals("add")) {
                System.out.println(library.add(p[1], p[2]));
            } else if (command.equals("join")) {
                System.out.println(library.join(p[1]));
            } else if (command.equals("borrow")) {
                System.out.println(library.borrow(p[1], p[2]));
            } else if (command.equals("return")) {
                System.out.println(library.giveBack(p[1]));
            } else if (command.equals("list")) {
                for (String line : library.list()) System.out.println(line);
            } else if (command.equals("exit")) {
                System.out.println(library.summary());
                System.out.println("Goodbye!");
                running = false;
            } else {
                System.out.println("Unknown command");
            }
        }
    }
}

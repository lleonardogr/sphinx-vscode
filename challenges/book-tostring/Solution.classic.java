import java.util.Scanner;

class Book {
    private final String title;
    private final String author;
    private final int year;

    Book(String title, String author, int year) {
        this.title = title;
        this.author = author;
        this.year = year;
    }

    @Override
    public String toString() {
        return "\"" + title + "\" by " + author + " (" + year + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String[] parts = scanner.nextLine().split(";");
            Book book = new Book(parts[0], parts[1], Integer.parseInt(parts[2]));
            System.out.println(book);
        }
    }
}

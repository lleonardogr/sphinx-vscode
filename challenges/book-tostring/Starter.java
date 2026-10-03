// TODO: create a class Book with fields title, author and year,
// a constructor, and a toString() method that returns:
//   "<title>" by <author> (<year>)

void main() {
    Scanner scanner = new Scanner(System.in);
    int n = Integer.parseInt(scanner.nextLine().trim());
    for (int i = 0; i < n; i++) {
        String[] parts = scanner.nextLine().split(";");
        String title = parts[0];
        String author = parts[1];
        int year = Integer.parseInt(parts[2]);
        // TODO: create a Book and print it directly, e.g. IO.println(book);
    }
}

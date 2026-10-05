void main() {
    Map<String, String> book = new TreeMap<>();
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String[] p = IO.readln().trim().split(" ");
        switch (p[0]) {
            case "add" -> IO.println((book.put(p[1], p[2]) == null ? "Added " : "Updated ") + p[1]);
            case "find" -> IO.println(book.containsKey(p[1]) ? p[1] + ": " + book.get(p[1]) : p[1] + " not found");
            case "remove" -> IO.println(book.remove(p[1]) != null ? "Removed " + p[1] : p[1] + " not found");
            case "list" -> {
                if (book.isEmpty()) IO.println("Phone book is empty");
                for (var entry : book.entrySet()) {
                    IO.println(entry.getKey() + ": " + entry.getValue());
                }
            }
        }
    }
}

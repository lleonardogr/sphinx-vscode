// TODO: create a class Person with:
//   - two fields: String name and int age
//   - a constructor Person(String name, int age)
//   - a method String introduce() that returns "Hi, I'm <name> and I'm <age> years old."

void main() {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    for (int i = 0; i < n; i++) {
        String name = scanner.next();
        int age = scanner.nextInt();
        // TODO: create a Person object and print what introduce() returns
    }
}

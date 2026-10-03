void main() {
    String name = IO.readln().trim();
    int age = Integer.parseInt(IO.readln().trim());
    IO.println("Hello, " + name + "!");
    IO.println("Next year you will be " + (age + 1) + " years old.");
}

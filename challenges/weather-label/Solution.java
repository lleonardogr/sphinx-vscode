void main() {
    int temperature = Integer.parseInt(IO.readln().trim());
    String label = temperature > 30 ? "Hot" : temperature < 10 ? "Cold" : "Mild";
    IO.println(label);
}

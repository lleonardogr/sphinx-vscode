void main() {
    int total = Integer.parseInt(IO.readln().trim());
    int hours = total / 3600;
    int rest = total % 3600;
    IO.println("Hours: " + hours);
    IO.println("Minutes: " + rest / 60);
    IO.println("Seconds: " + rest % 60);
}

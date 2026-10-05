void main() {
    int minutes = Integer.parseInt(IO.readln().trim());
    if (minutes <= 30) {
        IO.println("Fee: free");
    } else {
        int hours = (minutes + 59) / 60;
        IO.println("Fee: %.2f".formatted(Math.min(hours * 5.0, 40.0)));
    }
}

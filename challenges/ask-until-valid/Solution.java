int parseAge(String text) {
    int age = Integer.parseInt(text);
    if (age < 0 || age > 120) {
        throw new IllegalArgumentException("Out of range: " + age);
    }
    return age;
}

void main() {
    while (true) {
        String text = IO.readln().trim();
        try {
            int age = parseAge(text);
            IO.println("Age accepted: " + age);
            break;
        } catch (NumberFormatException e) {
            IO.println("Not a number: " + text);
        } catch (IllegalArgumentException e) {
            IO.println(e.getMessage());
        }
    }
}

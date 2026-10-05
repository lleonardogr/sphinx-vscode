import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String password = scanner.nextLine();
        List<String> problems = new ArrayList<>();
        if (password.length() < 8) problems.add("Too short");
        if (password.chars().noneMatch(Character::isUpperCase)) problems.add("Needs an uppercase letter");
        if (password.chars().noneMatch(Character::isLowerCase)) problems.add("Needs a lowercase letter");
        if (password.chars().noneMatch(Character::isDigit)) problems.add("Needs a digit");
        if (problems.isEmpty()) problems.add("Strong password");
        problems.forEach(System.out::println);
    }
}

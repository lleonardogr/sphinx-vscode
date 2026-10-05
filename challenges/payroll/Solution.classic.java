import java.util.*;

abstract class Employee {
    private final String name;

    Employee(String name) {
        this.name = name;
    }

    String getName() {
        return name;
    }

    abstract String type();

    abstract double pay();
}

class Salaried extends Employee {
    private final double monthly;

    Salaried(String name, double monthly) {
        super(name);
        this.monthly = monthly;
    }

    String type() {
        return "Salaried";
    }

    double pay() {
        return monthly;
    }
}

class Hourly extends Employee {
    private final double rate;
    private final int hours;

    Hourly(String name, double rate, int hours) {
        super(name);
        this.rate = rate;
        this.hours = hours;
    }

    String type() {
        return "Hourly";
    }

    double pay() {
        int extra = Math.max(0, hours - 160);
        return (hours - extra) * rate + extra * rate * 1.5;
    }
}

class Commissioned extends Employee {
    private final double base;
    private final double sales;
    private final double percent;

    Commissioned(String name, double base, double sales, double percent) {
        super(name);
        this.base = base;
        this.sales = sales;
        this.percent = percent;
    }

    String type() {
        return "Commissioned";
    }

    double pay() {
        return base + sales * percent / 100;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Employee> staff = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String kind = scanner.next();
            String name = scanner.next();
            if (kind.equals("salaried")) {
                staff.add(new Salaried(name, scanner.nextDouble()));
            } else if (kind.equals("hourly")) {
                staff.add(new Hourly(name, scanner.nextDouble(), scanner.nextInt()));
            } else {
                staff.add(new Commissioned(name, scanner.nextDouble(), scanner.nextDouble(), scanner.nextDouble()));
            }
        }
        double total = 0;
        Employee top = null;
        for (Employee e : staff) {
            System.out.printf("%s (%s): %.2f%n", e.getName(), e.type(), e.pay());
            total += e.pay();
            if (top == null || e.pay() > top.pay()) top = e;
        }
        System.out.printf("Total payroll: %.2f%n", total);
        System.out.println("Top earner: " + top.getName());
    }
}

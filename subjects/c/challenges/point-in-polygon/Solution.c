#include <stdio.h>
#include <math.h>

typedef struct {
    double x, y;
} Point;

typedef struct {
    int n;
    Point vertex[100];
} Polygon;

static double area(const Polygon *p) {
    double twice = 0;
    for (int i = 0; i < p->n; i++) {
        Point a = p->vertex[i], b = p->vertex[(i + 1) % p->n];
        twice += a.x * b.y - b.x * a.y;
    }
    return fabs(twice) / 2;
}

static double perimeter(const Polygon *p) {
    double total = 0;
    for (int i = 0; i < p->n; i++) {
        Point a = p->vertex[i], b = p->vertex[(i + 1) % p->n];
        total += hypot(b.x - a.x, b.y - a.y);
    }
    return total;
}

/* Ray casting: count the edges that a ray going right from q crosses. */
static int inside(const Polygon *p, Point q) {
    int crossings = 0;
    for (int i = 0, j = p->n - 1; i < p->n; j = i++) {
        Point a = p->vertex[i], b = p->vertex[j];
        if ((a.y > q.y) != (b.y > q.y)) {
            double x = a.x + (q.y - a.y) * (b.x - a.x) / (b.y - a.y);
            if (q.x < x) {
                crossings++;
            }
        }
    }
    return crossings % 2 == 1;
}

int main(void) {
    Polygon poly;
    scanf("%d", &poly.n);
    for (int i = 0; i < poly.n; i++) {
        scanf("%lf %lf", &poly.vertex[i].x, &poly.vertex[i].y);
    }
    printf("Area: %.2f\nPerimeter: %.2f\n", area(&poly), perimeter(&poly));
    int q;
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        Point point;
        scanf("%lf %lf", &point.x, &point.y);
        printf("(%g, %g) %s\n", point.x, point.y, inside(&poly, point) ? "inside" : "outside");
    }
    return 0;
}

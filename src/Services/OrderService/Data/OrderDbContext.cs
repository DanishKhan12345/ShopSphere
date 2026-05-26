using Microsoft.EntityFrameworkCore;
using OrderService.Entities;
using System.Reflection.Emit;

namespace OrderService.Data;

public sealed class OrderDbContext : DbContext
{
    public OrderDbContext(DbContextOptions<OrderDbContext> options)
        : base(options)
    {
    }

    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(order => order.Id);

            entity.Property(order => order.UnitPrice)
                .HasPrecision(18, 2);

            entity.Property(order => order.TotalPrice)
                .HasPrecision(18, 2);
        });

        base.OnModelCreating(modelBuilder);
    }
}
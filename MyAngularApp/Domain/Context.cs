using Microsoft.EntityFrameworkCore;
using System;

namespace MyAngularApp.Domain
{
    public class Context : DbContext
    {
        public Context() {  }
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Operation> Operations { get; set; }
        public DbSet<Customer> Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {

            modelBuilder.Entity<City>().HasData(
                new City { Id = 1, Name = "Venice"},
                new City { Id = 2, Name = "Sarasota" },
                new City { Id = 3, Name = "Northport" },
                new City { Id = 4, Name = "Osprey" }
                );

            modelBuilder.Entity<Operation>().HasData(
                new Operation { Id = 1, Name = "Install" },
                new Operation { Id = 2, Name = "Removal" }
                );

            modelBuilder.Entity<Customer>().HasData(
                new Customer { Id = 1, Name = "Coldwell Banker" },
                new Customer { Id = 2, Name = "ReMax" }
                );

        }
    }
}
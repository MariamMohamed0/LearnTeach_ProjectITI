using LearnTeach.Application.Dtos.PostDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Infrastructure.Data;

public  class Repository<T> :IRepository<T> where T : class
{
    private readonly LEANRANDTEACHContext _context;
    private readonly DbSet<T> _entities;

    public Repository(LEANRANDTEACHContext context)
    {
        _context = context;
        _entities = _context.Set<T>(); 
    }

    public async Task AddAsync(T entity) => await _entities.AddAsync(entity);
    public async Task AddRangeAsync(IEnumerable<T> entities) => await _entities.AddRangeAsync(entities);
    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate) =>
        await _entities.Where(predicate).ToListAsync();

    public async Task<IEnumerable<T>> GetAllAsync() => await _entities.ToListAsync();
    public async Task<T> GetByIdAsync(object id) => await _entities.FindAsync(id);
    public void Remove(T entity) => _entities.Remove(entity);
    public void RemoveRange(IEnumerable<T> entities) => _entities.RemoveRange(entities);
    public void Update(T entity) => _entities.Update(entity);
    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

    // ✅ جديد: Query method لدعم Include
    public IQueryable<T> Query() => _entities.AsQueryable();

   
}

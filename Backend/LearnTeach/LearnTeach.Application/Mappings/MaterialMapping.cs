using AutoMapper;
using LearnTeach.Application.Dtos.CategoryDtos;
using LearnTeach.Application.Dtos.MaterialDtos;
using LearnTeach.Domain.Models;

namespace LearnTeach.Api.Mappings
{
    public class MaterialMapping : Profile
    {
        public MaterialMapping()
        {
            CreateMap<Material, MaterialDto>().ReverseMap();


            CreateMap<Material, CreateMaterialDto>().ReverseMap();

            CreateMap<Material, UpdateMaterialDto>().ReverseMap();

            CreateMap<Categoriess, CategoryDto>().ReverseMap();
            CreateMap<Categoriess, CreateCategoryDto>().ReverseMap();
            CreateMap<Categoriess, UpdateCategoryDto>().ReverseMap();

        }
    }
}

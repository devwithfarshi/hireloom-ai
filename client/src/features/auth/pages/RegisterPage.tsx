import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Building, CheckCircle, Search, Users } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";
import { Role } from "../types";

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role");

  const handleRoleSelect = (selectedRole: Role.RECRUITER | Role.CANDIDATE) => {
    navigate(`/register?role=${selectedRole}`);
  };
  const roleOptions: {
    type: Role.RECRUITER | Role.CANDIDATE;
    icon: typeof Building | typeof Users;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    gradient: string;
    bgGradient: string;
  }[] = [
    {
      type: Role.RECRUITER,
      icon: Building,
      title: "Recruiter",
      subtitle: "Hire top talent",
      description:
        "Create job postings, manage candidates, and build your dream team",
      features: [
        "Post unlimited jobs",
        "Advanced candidate filtering",
        "Team collaboration tools",
        "Analytics dashboard",
      ],
      gradient: "from-blue-500 to-purple-600",
      bgGradient:
        "from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
    },
    {
      type: Role.CANDIDATE,
      icon: Search,
      title: "Candidate",
      subtitle: "Find your dream job",
      description:
        "Apply for positions, track applications, and advance your career",
      features: [
        "Smart job matching",
        "Application tracking",
        "Career insights",
        "Interview scheduling",
      ],
      gradient: "from-emerald-500 to-teal-600",
      bgGradient:
        "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
    },
  ];
  return (
    <AuthLayout>
      {!role ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-lg mb-4">
              <Users className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Choose Your Path
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select the account type that matches your goals and start your
              journey with us
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {roleOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card
                  key={option.type}
                  className={`relative p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group border-2 hover:border-transparent bg-gradient-to-br ${option.bgGradient} overflow-hidden`}
                  onClick={() => handleRoleSelect(option.type)}
                >
                  {/* Background gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="relative z-10 space-y-6">
                    {/* Icon and title */}
                    <div className="text-center space-y-4">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${option.gradient} rounded-2xl shadow-lg`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                          {option.title}
                        </h2>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {option.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      {option.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3">
                      {option.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle
                            className={`w-4 h-4 bg-gradient-to-r ${option.gradient} bg-clip-text text-transparent`}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Button */}
                    <Button
                      className={`w-full bg-gradient-to-r ${option.gradient} hover:shadow-lg hover:scale-105 transition-all duration-200 text-white border-0 py-3 font-semibold group/btn`}
                    >
                      <span>Select {option.title}</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You can always switch between account types later in your settings
            </p>
          </div>
        </div>
      ) : (
        <RegisterForm />
      )}
    </AuthLayout>
  );
}

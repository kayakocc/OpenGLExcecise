#version 330 core

out vec4 FragColor;
in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoord;

struct Material {
    vec3 ambient;
    sampler2D diffuse;
    sampler2D specular;
    float shininess;
    //sampler2D emission;
};

struct LightPoint {
    float constant;
    float linear;
    float quadratic;
};

struct LightSpot {
    float cosPhyInner;
    float cosPhyOutter;
};

struct LightDirectional{
    vec3 pos;
    vec3 color;
    vec3 dirToLight;
};

uniform Material material;
uniform LightPoint lightP;
uniform LightSpot lightS;


//uniform sampler2D ourTexture;
//uniform sampler2D ourFace;
uniform vec3 objColor;
uniform vec3 ambientColor;
uniform vec3 lightPos;
uniform vec3 lightDirUniform;
uniform vec3 lightColor;
uniform vec3 cameraPos;

void main()
{
   float dist = length(lightPos - FragPos);
   float attenuation = 1.0 / (lightP.constant + lightP.linear * dist + lightP.quadratic * (dist * dist));
   
   vec3 lightDir = normalize(lightPos - FragPos);
   vec3 reflectDir = reflect(-lightDir, Normal);
   vec3 cameraVec = normalize(cameraPos - FragPos);

   float specularAmount = pow(max(dot(cameraVec, reflectDir), 0.0), material.shininess);
   vec3 specular = texture(material.specular, TexCoord).rgb * specularAmount * lightColor;

   vec3 diffuse = texture(material.diffuse, TexCoord).rgb * max(dot(lightDir, Normal), 0) * lightColor;
   //vec3 diffuse = texture(material.diffuse, Texcoord).rgb;

   vec3 ambient = texture(material.diffuse, TexCoord).rgb * ambientColor;

   //vec3 emission = texture(material.emission, TexCoord).rgb;

   float cosTheta = dot(normalize(FragPos - lightPos), -1*lightDirUniform);

   float spotRatio;
   if(cosTheta > lightS.cosPhyInner){
       spotRatio = 1.0f;
   }else if(cosTheta > lightS.cosPhyOutter){
       spotRatio = (cosTheta - lightS.cosPhyOutter)/(lightS.cosPhyInner - lightS.cosPhyOutter);
   }else{
       spotRatio = 0.0f;
   }
   FragColor = vec4((ambient + (diffuse + specular) * spotRatio) * objColor, 1.0f);
//   if(cosTheta > lightS.cosPhy){
//       FragColor = vec4((ambient + (diffuse + specular)) * objColor, 1.0f);
//   }else{
//       FragColor = vec4(ambient * objColor, 1.0f);
//   }

   //FragColor = vec4(objectColor * ambientColor, 1.0f);
}
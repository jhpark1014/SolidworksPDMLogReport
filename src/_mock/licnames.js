const licnames = [
  {
    lic_id: 'cae_cosmosfloworks_elec',
    lic_name: 'Electronics Module for SOLIDWORKS Flow Simulation',
  },
  {
    lic_id: 'cae_cosmosfloworks_hvac',
    lic_name: 'HVAC Module for SOLIDWORKS Flow Simulation',
  },
  {
    lic_id: 'cae_cosmosfloworkspe',
    lic_name: 'SOLIDWORKS Flow Simulation',
  },
  {
    lic_id: 'cae_cwstd',
    lic_name: 'SOLIDWORKS Simulation Standard',
  },
  {
    lic_id: 'cae_cwpro',
    lic_name: 'SOLIDWORKS Simulation Professional',
  },
  {
    lic_id: 'cae_cwadvpro',
    lic_name: 'SOLIDWORKS Simulation Premium',
  },
  {
    lic_id: 'cae_cosmosemsbasic',
    lic_name: 'Cosmos EMS Basic',
  },
  {
    lic_id: 'cae_cosmosemsadv',
    lic_name: 'Cosmos EMS Advanced',
  },
  {
    lic_id: 'swsustainability',
    lic_name: 'SOLIDWORKS Sustainability',
  },
  {
    lic_id: 'plastics_professional',
    lic_name: 'SOLIDWORKS Plastics Standard',
  },
  {
    lic_id: 'plastics_premium',
    lic_name: 'SOLIDWORKS Plastics Professional',
  },
  {
    lic_id: 'plastics_advanced',
    lic_name: 'SOLIDWORKS Plastics Premium',
  },
  {
    lic_id: 'campro',
    lic_name: 'SOLIDWORKS CAM Professional',
  },
  {
    lic_id: 'camstd',
    lic_name: 'SOLIDWORKS CAM Standard',
  },
  {
    lic_id: 'draftsightpremium',
    lic_name: 'DraftSight Premium',
  },
  {
    lic_id: 'draftsightentplus',
    lic_name: 'DraftSight Enterprise Plus',
  },
  {
    lic_id: 'elec2d',
    lic_name: 'SOLIDWORKS Electrical Schematic Professional',
  },
  {
    lic_id: 'elec3d',
    lic_name: 'SOLIDWORKS Electrical 3D',
  },
  {
    lic_id: 'elecpro',
    lic_name: 'Electrical Professional',
  },
  {
    lic_id: 'snlcore',
  },
  {
    lic_id: 'solidworks',
    lic_name: 'SOLIDWORKS Standard',
  },
  {
    lic_id: 'swofficepro',
    lic_name: 'SOLIDWORKS Professional',
  },
  {
    lic_id: 'swofficepremium',
    lic_name: 'SOLIDWORKS Premium',
  },
  {
    lic_id: 'swcomposer',
    lic_name: 'SOLIDWORKS Composer Professional',
  },
  {
    lic_id: 'swepdm_cadeditor',
    lic_name: 'SOLIDWORKS PDM Professional CAD Editor',
  },
  {
    lic_id: 'swepdm_cadeditorandweb',
    lic_name: 'SOLIDWORKS PDM Professional CAD Editor & Web',
  },
  {
    lic_id: 'swepdm_contributor',
    lic_name: 'SOLIDWORKS PDM Professional Contributor',
  },
  {
    lic_id: 'swepdm_contributorandweb',
    lic_name: 'SOLIDWORKS PDM Professional Contributor & Web',
  },
  {
    lic_id: 'swepdm_processor',
    lic_name: 'SOLIDWORKS PDM Professionl Processor License',
  },
  {
    lic_id: 'swepdm_viewer',
    lic_name: 'SOLIDWORKS PDM Professional Viewer',
  },
  {
    lic_id: 'swepdm_web',
    lic_name: 'SOLIDWORKS PDM Professional Web',
  },
  {
    lic_id: 'swepdmstd_cadeditor',
    lic_name: 'SOLIDWORKS PDM Standard CAD Editor',
  },
  {
    lic_id: 'swepdmstd_contributor',
    lic_name: 'SOLIDWORKS PDM Standard Contributor',
  },
  {
    lic_id: 'swepdmstd_viewer',
    lic_name: 'SOLIDWORKS PDM Standard Viewer',
  },
  {
    lic_id: 'swpdm_processor',
    lic_name: 'PDM Professional PSL',
  },
  {
    lic_id: 'swmanagepro_contributor',
    lic_name: 'SOLIDWORKS Manage Professional Contributor',
  },
  {
    lic_id: 'swmanagepro_editor',
    lic_name: 'SOLIDWORKS Manage Professional Editor',
  },
  {
    lic_id: 'swmanagepro_processor',
    lic_name: 'SOLIDWORKS Manage Professional Processor',
  },
  {
    lic_id: 'swmanagepro_viewer',
    lic_name: 'SOLIDWORKS Manage Professional Viewer',
  },
  {
    lic_id: 'swmbd_std',
    lic_name: 'SOLIDWORKS MBD Standard',
  },
  {
    lic_id: 'visuboost',
    lic_name: 'SOLIDWORKS Visualize Boost',
  },
  {
    lic_id: 'visupro',
    lic_name: 'SOLIDWORKS Visualize Professional',
  },
  {
    lic_id: 'visustd',
    lic_name: 'SOLIDWORKS Visualize Standard',
  },
  {
    lic_id: 'scanto3d',
    lic_name: 'Scan to 3D',
  },
  {
    lic_id: 'harnessing',
    lic_name: 'Harnessing',
  },
  {
    lic_id: 'photoworks',
    lic_name: 'PhotoWorks Release2',
  },
  {
    lic_id: 'featureworks',
    lic_name: 'FeatureWorks',
  },
  {
    lic_id: 'piping',
    lic_name: 'Piping',
  },
  {
    lic_id: 'animator',
    lic_name: 'SOLIDWORKS Animator',
  },
  {
    lic_id: 'toolbox',
    lic_name: 'Toolbox',
  },
  {
    lic_id: '3diws',
    lic_name: '3D Instant Website',
  },
  {
    lic_id: 'utilities',
    lic_name: 'SOLIDWORKS Utilities',
  },
  {
    lic_id: 'taskscheduler',
    lic_name: 'Task Scheduler',
  },
  {
    lic_id: 'catiatoswtrans',
    lic_name: 'CATIA V5-SOLIDWORKS Translator',
  },
  {
    lic_id: 'edrw',
    lic_name: 'SOLIDWORKS eDrawings Professional',
  },
];

export default licnames;

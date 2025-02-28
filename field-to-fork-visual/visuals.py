import pandas as pd
import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output
import plotly.express as px
import plotly.graph_objects as go

file_path = 'fruitvegprices-2017_2022.csv'
df = pd.read_csv(file_path)

# Convert date column to datetime
df['date'] = pd.to_datetime(df['date'])

# Replace underscores with spaces
df['category'] = df['category'].str.replace('_', ' ')
df['item'] = df['item'].str.replace('_', ' ')
df['variety'] = df['variety'].str.replace('_', ' ')

app = dash.Dash(suppress_callback_exceptions=False)

# Layout
app.layout = html.Div([

    # Main container with two divs: left for selections and right for stats
    html.Div([
        # Left div containing category, item, and variety selectors
        html.Div([
            html.Label("Select Category:",
                       style={'display': 'block', 
                              'marginTop': '20px', 
                              'marginBottom': '10px'}),
            dcc.RadioItems(
                id='category-radio',
                options=[{'label': cat, 'value': cat}
                         for cat in df['category'].unique()],
                value=df['category'].unique()[0],
                inline=True,
                style={
                    'display': 'flex',
                    'justifyContent': 'space-between',
                    'flexWrap': 'wrap'
                }
            ),

            html.Label("Select Item:", 
                       style={
                           'display': 'block', 
                           'marginTop': '20px', 
                           'marginBottom': '10px'}),
            dcc.Dropdown(
                id='item-dropdown',
                options=[],  # Populated dynamically
                value=None,
                placeholder="Select an item",
                style={
                    'border': '0.5px solid #0A7029',
                    'borderRadius': '1.5px'
                }
            ),

            html.Label("Select Variety:",
                       style={'display': 'block', 
                              'marginTop': '20px', 
                              'marginBottom': '10px'}),
            dcc.Dropdown(
                id='variety-dropdown',
                options=[],  # Populated dynamically
                value=None,
                placeholder="Select a variety",
                style={
                    'border': '0.5px solid #0A7029',
                    'borderRadius': '1.5px'
                }
            ),
        ], style={
            'flex': '3',  
            'padding': '20px',
            'backgroundColor': 'rgba(255, 255, 255, 0.8)',
            'borderRadius': '8px',
            'boxShadow': '0px 4px 6px rgba(0, 0, 0, 0.1)',
            'marginRight': '10px'  # Add some space to separate from the right div
        }),

        # Right div containing the price-stats
        html.Div([
            html.Div(id='price-stats', style={
                'backgroundColor': '#0A7029',
                'color': 'white',
                'padding': '10px',
                'borderRadius': '8px',
                'boxShadow': '0px 4px 6px rgba(0, 0, 0, 0.1)',
                'fontSize': '16px',
                'display': 'flex',
                'flexDirection': 'column',  # Stack children vertically
                'alignItems': 'center',  # Center align items horizontally
                'height': '100%',  # Ensure it takes up all the height of the container
                'width': '100%'  # Ensure it takes up all the width of the container
            }),
        ], style={
            'flex': '1',  
            'display': 'flex',
            'justifyContent': 'flex-end',  # Align to the right side
            'padding': '20px',
            'height': '100%'  # Make sure the height matches the left div
        })
    ], style={
        'display': 'flex',
        'justifyContent': 'space-between',  # Space between left and right divs
        'alignItems': 'stretch',  # Stretch items to match height
        'marginTop': '20px'
    }),

    # Scatter plot
    dcc.Graph(id='price-scatter'),

])

# Callback to update item dropdown based on selected category


@app.callback(
    [Output('item-dropdown', 'options'),
     Output('item-dropdown', 'value')],
    [Input('category-radio', 'value')]
)
def update_item_dropdown(selected_category):
    filtered_items = df[df['category'] == selected_category]['item'].unique()
    options = [{'label': item, 'value': item} for item in filtered_items]
    return options, (options[0]['value'] if options else None)

# Callback to update variety dropdown based on selected item


@app.callback(
    [Output('variety-dropdown', 'options'),
     Output('variety-dropdown', 'value')],
    [Input('category-radio', 'value'),
     Input('item-dropdown', 'value')]
)
def update_variety_dropdown(selected_category, selected_item):
    if not selected_item:
        return [], None

    filtered_varieties = df[(df['category'] == selected_category) & (
        df['item'] == selected_item)]['variety'].unique()

    options = [{'label': var, 'value': var} for var in filtered_varieties]
    return options, (options[0]['value'] if options else None)

# Callback to update scatter plot and price stats based on category, item, and variety


@app.callback(
    [Output('price-scatter', 'figure'),
     Output('price-stats', 'children')],
    [Input('category-radio', 'value'),
     Input('item-dropdown', 'value'),
     Input('variety-dropdown', 'value')]
)
def update_scatter_plot_and_stats(selected_category, selected_item, selected_variety):
    if not selected_item or not selected_variety:
        return go.Figure(), ""

    # Filter data
    filtered_df = df[(df['category'] == selected_category) &
                     (df['item'] == selected_item) &
                     (df['variety'] == selected_variety)]

    price_type = filtered_df['unit'].unique(
    )[0] if not filtered_df.empty else "Unknown"

    # Sort by date
    filtered_df = filtered_df.sort_values(by='date')

    # Scatter plot with font change
    fig = px.scatter(
        filtered_df,
        x='date',
        y='price',
        title=f'Price Dynamics for {selected_item} ({selected_variety}) £ per {price_type}',
        labels={'price': 'Price', 'date': 'Date'},
        template='plotly_white'
    )

    # Set font family globally for the figure
    fig.update_layout(
        font=dict(family='Helvetica Neue')
    )
    fig.update_traces(marker=dict(color='#0A7029'))


    # Price range and average for the last year
    last_year_df = filtered_df[filtered_df['date'] >
                               filtered_df['date'].max() - pd.DateOffset(years=1)]

    if not last_year_df.empty:
        min_price = last_year_df['price'].min()
        max_price = last_year_df['price'].max()
        avg_price = last_year_df['price'].mean()
        stats_range = f"Price Range (Last Year): £{min_price:.2f} - £{max_price:.2f}" 
        stats_average = f"Average: £{avg_price:.2f}"
        stats = [
            html.Div(stats_range, style={'paddingBottom': '10px'}),
            html.Div(stats_average)
        ]
    else:
        stats = [html.Div("Not enough data for the last year.")]

    return fig, stats


# Run the app
if __name__ == '__main__':
    app.run_server(host='localhost', port=3500)
